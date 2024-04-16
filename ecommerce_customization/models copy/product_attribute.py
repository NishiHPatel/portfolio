# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _


class ProductAttribute(models.Model):
    _inherit = 'product.attribute'

    is_use_in_search = fields.Boolean(string='Use in search')
    is_use_in_compare = fields.Boolean(string='Use in compare')
    is_use_in_filter = fields.Boolean(string='Use in filter')
    priority_sequence = fields.Integer(string="Priority Sequence")