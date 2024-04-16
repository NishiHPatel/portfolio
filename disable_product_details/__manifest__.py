# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.
{
    'name': "Website Hide Price, Add to Cart and Qty on Shop ",
    'version': '16.0.0.0',
    "category": 'Website',
    'summary': 'Disable product details such as product price, qty and add to cart based on user selection',
    'description': """

        Disable Price, Qty and Add to Cart Option on Shop in odoo,
        Disable Product Details for Non Login User in odoo,
        Disable Product Details for All Users in odoo,
        Disable Product Price in odoo,
        Disable Add to Cart in odoo,
        Disable Qty Option in odoo,
        Disable Product Details in odoo,

    """,
    'author': 'Nishi',
    'depends': ['base', 'website','website_sale'],
    'data': [
        'views/res_config_settings_view.xml',
        'templates/shop.xml',
    ],
    'installable': True,
    'auto_install': False,
}
