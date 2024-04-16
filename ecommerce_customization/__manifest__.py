# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.


{
    'name': 'E-commmerce Customization',
    'version': '16.0.0.0',
    'category': 'ecommerce',
    'summary': 'E-commerce shop customization',
    "description": """
       E-commerce shop customization
    """,
    'author': 'Nishi',
    'depends' : ['website','website_sale','sale','stock','sale_management'],
    'data': [
        'security/ir.model.access.csv',
        'data/ircron.xml',
        'data/preorder_notification_mail_template.xml',
        'views/sale_inherit_views.xml',
        'views/website_preorder_views.xml',
        'views/product_product_inherit.xml',
        'views/product_attribute_views.xml',
        'templates/website_sale_comparision_template.xml',
        'templates/assets.xml',
        'templates/website_sale.xml',
        'templates/portal_inherit_views.xml',
            ],
    'qweb': [],
    'installable': True,
    'auto_install': False,
    'assets':{
        'web.assets_frontend':[
            'ecommerce_customization/static/src/js/website_preorder.js',
        ],
    },
}
