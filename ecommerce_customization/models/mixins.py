# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from odoo.osv import expression
from odoo.tools import escape_psql

class WebsiteSearchableMixin(models.AbstractModel):
    _inherit = 'website.searchable.mixin'

    @api.model
    def _search_build_domain(self, domain_list, search, fields, extra=None):
        """
        Builds a search domain AND-combining a base domain with partial matches of each term in
        the search expression in any of the fields.

        :param domain_list: base domain list combined in the search expression
        :param search: search expression string
        :param fields: list of field names to match the terms of the search expression with
        :param extra: function that returns an additional subdomain for a search term

        :return: domain limited to the matches of the search expression
        """
        domains = domain_list.copy()
        attribute_value_ids = self.env['product.attribute.value']
        subdomains = []
        if search:
            for search_term in search.split(' '):
                attribute_value_ids = self.env['product.attribute.value'].search([('name','ilike',search_term), ('attribute_id.is_use_in_search','=', True)])
                if self._name == 'product.template':
                    subdomains = [[('attribute_line_ids.value_ids','in', attribute_value_ids.ids)]]
                subdomains += [[(field, 'ilike', escape_psql(search_term))] for field in fields]
                if extra:
                    subdomains.append(extra(self.env, search_term))
                domains.append(expression.OR(subdomains))
        return expression.AND(domains)
