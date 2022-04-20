'use strict';

/**
 * audiobook service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::audiobook.audiobook');
