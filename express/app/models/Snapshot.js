const { Model, transaction } = require('objection');
const BaseModel = require('./BaseModel');
const SnapshotDiff = require('./SnapshotDiff');
const SnapshotDiffCenter = require('./SnapshotDiffCenter');
const SnapshotFlake = require('./SnapshotFlake');

class Snapshot extends BaseModel {
  static get tableName() {
    return 'snapshot';
  }

  async canRead(user) {
    return user.organizations.map(o => o.id).includes(this.organizationId);
  }

  async canCreate(user) {
    return false;
  }

  async canEdit(user) {
    return this.canRead(user);
  }

  static async createSnapshots({
    build,
    title,
    widths,
    browsers,
    hideSelectors,
    selectors,
    sourceLocation,
    sha,
  }) {
    for await (const browser of browsers) {
      for await (const width of widths) {
        for await (const selector of selectors) {
          await Snapshot.query().insert({
            title,
            width,
            sourceLocation,
            browser,
            selector,
            hideSelectors,
            sha,
            buildId: build.id,
            projectId: build.projectId,
            organizationId: build.organizationId,
          });
        }
      }
    }
  }

  static async getModifiedFromBuild(trx = null, buildId) {
    const { modifiedSnapshotCount } = await Snapshot.query(trx)
      .where('buildId', buildId)
      .where('diff', true)
      .count('id as modifiedSnapshotCount')
      .first();
    return parseInt(modifiedSnapshotCount);
  }

  async compared(
    imageLocation,
    difference,
    diffLocation,
    differenceAmount,
    diffSha,
    flakeMatched,
    centers,
  ) {
    let trx;
    try {
      trx = await transaction.start(this.$knex());
      const update = {
        imageLocation,
        diff: difference,
        flake: flakeMatched,
      };
      if (flakeMatched) {
        const snapshotFlake = await SnapshotFlake.query(trx)
          .where('sha', diffSha)
          .first();
        if (snapshotFlake) {
          await snapshotFlake.$query(trx).update({
            matchCount: snapshotFlake.matchCount + 1,
          });
          update.snapshotFlakeMatchedId = snapshotFlake.id;
          const snapshotDiff = await snapshotFlake
            .$relatedQuery('snapshotDiff')
            .first();
          await SnapshotDiff.query(trx).insert({
            imageLocation: snapshotDiff.imageLocation,
            differenceAmount: snapshotDiff.differenceAmount,
            sha: snapshotDiff.sha,
            snapshotFromId: this.previousApprovedId,
            snapshotToId: this.id,
            buildId: this.buildId,
            organizationId: this.organizationId,
          });
        }
      }

      await this.$query(trx).update(update);
      if (diffLocation) {
        if (difference) {
          const snapshotDiff = await SnapshotDiff.query(trx).insert({
            imageLocation: diffLocation,
            differenceAmount,
            sha: diffSha,
            snapshotFromId: this.previousApprovedId,
            snapshotToId: this.id,
            buildId: this.buildId,
            organizationId: this.organizationId,
          });
          if (centers && centers.length > 0) {
            await Promise.all(
              centers.map(center =>
                SnapshotDiffCenter.query(trx).insert({
                  x: center.x,
                  y: center.y,
                  radius: center.radius,
                  snapshotDiffId: snapshotDiff.id,
                  buildId: this.buildId,
                  organizationId: this.organizationId,
                })
              )
            );
          }
        }
      }

      const { count } = await Snapshot.query(trx)
        .where('buildId', this.buildId)
        .whereNull('imageLocation')
        .count('id')
        .first();

      if (parseInt(count) === 0) {
        if (!this.build) {
          this.build = await this.$relatedQuery('build');
        }
        await this.build.groupDiffs(trx);
        await this.build.compared(trx);
      }

      await trx.commit();
    } catch (err) {
      console.error(err);
      await trx.rollback();
      throw err;
    }
  }

  static authorizationFilter(user) {
    return this.query().whereIn(
      'snapshot.organizationId',
      user.organizations.map(o => o.id),
    );
  }

  static get relationMappings() {
    const Organization = require('./Organization');
    const OrganizationMember = require('./OrganizationMember');
    const Build = require('./Build');
    return {
      snapshotFlake: {
        relation: Model.HasOneRelation,
        modelClass: SnapshotFlake,
        join: {
          from: 'snapshot.id',
          to: 'snapshotFlake.snapshot_id',
        },
      },
      snapshotFlakeMatched: {
        relation: Model.BelongsToOneRelation,
        modelClass: SnapshotFlake,
        join: {
          from: 'snapshot.snapshotFlakeMatchedId',
          to: 'snapshotFlake.id',
        },
      },
      snapshotFlakes: {
        relation: Model.HasManyRelation,
        modelClass: SnapshotFlake,
        join: {
          from: ['snapshot.title', 'snapshot.width'],
          to: ['snapshotFlake.title', 'snapshotFlake.width'],
        },
      },
      snapshotDiff: {
        relation: Model.HasOneRelation,
        modelClass: SnapshotDiff,
        join: {
          from: 'snapshot.id',
          to: 'snapshotDiff.snapshotToId',
        },
      },
      previousApproved: {
        relation: Model.HasOneRelation,
        modelClass: Snapshot,
        join: {
          from: 'snapshot.previousApprovedId',
          to: 'snapshot.id',
        },
      },
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: 'snapshot.organizationId',
          to: 'organization.id',
        },
      },
      approvedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: OrganizationMember,
        join: {
          from: 'snapshot.approvedById',
          to: 'organizationMember.id',
        },
      },
      build: {
        relation: Model.BelongsToOneRelation,
        modelClass: Build,
        join: {
          from: 'snapshot.buildId',
          to: 'build.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        location: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }
}

module.exports = Snapshot;
