# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _

class Website(models.Model):
    _inherit = 'website'

    disable_shop_page_details = fields.Boolean(string="Disable details on shop page")
    disable_option_for_user = fields.Selection([('public','public/non login user'),('all','All users')],string="Disable Options")
    disable_product_price = fields.Boolean(string='Disable Product price')
    disable_qty_option = fields.Boolean(string='Disable Qty Option')
    disable_add_to_cart = fields.Boolean(string='Disable Add to cart button')