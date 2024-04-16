odoo.define('ecommerce_customization.preorder', function (require) {
'use strict';

var ajax = require('web.ajax');
var rpc = require("web.rpc");
var publicWidget = require('web.public.widget');
var VariantMixin = require('sale.VariantMixin');
var wSaleUtils = require('website_sale.utils');
const cartHandlerMixin = wSaleUtils.cartHandlerMixin;
require("web.zoomodoo");
require('website_sale.website_sale');

    publicWidget.registry.WebsitePreorder = publicWidget.Widget.extend(VariantMixin, cartHandlerMixin,{
        selector: '.oe_website_sale',
        events: _.extend({}, VariantMixin.events || {}, {
            'click #preorder_to_cart, .add_cart_preorder': '_onClickPreorder',
            'change form .js_product input[name="add_qty"]': 'onChangeAddQuantity',
            'click input[name="add_qty"]': 'onClickAddQuantity',
            'change .oe_cart input.js_quantity[data-product-id]': '_onChangeCartQuantity',
            'click .oe_cart input.js_quantity[data-product-id]': '_onClickCartQuantity',
            'click #add_to_cart_custom': '_onClickAddTocart',
        }),
        

        start: async function(){
            this._super.apply(this, arguments);
            var product_id = $('input[name="product_template_id"]').val() || false;
            await ajax.jsonRpc('/product/qty/check', 'call', { 
                'product_id' : product_id,
            }).then(function(data){
                if(data[1] == 'preorder'){
                    $('#add_to_cart_custom').addClass('d-none');
                    $('#preorder_to_cart').removeClass('d-none');
                    $('.pre_order_policy').removeClass('d-none');
                    $('.form-control.quantity').val(data[0]).trigger("change");
                    
                }
                else if(data[1] == 'in_stock'){
                    $('#add_to_cart_custom').removeClass('d-none');
                    $('#preorder_to_cart').addClass('d-none');
                    $('.pre_order_policy').addClass('d-none');
                    $('.form-control.quantity').val(data[0]).trigger("change");
                }
            });
        },

        _onClickPreorder: function (ev) {
            var $parent;
            if ($(ev.currentTarget).closest('.oe_optional_products_modal').length > 0){
                $parent = $(ev.currentTarget).closest('.oe_optional_products_modal');
            } else if ($(ev.currentTarget).closest('form').length > 0){
                $parent = $(ev.currentTarget).closest('form');
            }  else { 
                $parent = $(ev.currentTarget).closest('.o_product_configurator');
            }
            var qty = $parent.find('.form-control').val();
            var $button = document.getElementById("add_to_cart");
            ajax.jsonRpc('/preorder/check', 'call', { 
                    'qty' :  qty,
                    'product_id' : this._getProductId($parent),
                }).then(function(data){
                    if (data == true){
                        $button.click();
                    }
                    else {
                        $('.add_cart_preorder').popover({content : data,
                            title: 'Warning',
                            placement: 'top',
                        });
                        $('.add_cart_preorder').popover('show');
                    }
                });    
        }, 

        _onChangeCartQuantity: function (ev) {
            var $input = $(ev.currentTarget);
            if ($input.data('update_change')) {
                return;
            }
            var value = parseInt($input.val() || 0, 10);
            if (isNaN(value)) {
                value = 1;
            }
            var productIDs = [parseInt($input.data('product-id'), 10)];
            ajax.jsonRpc('/preorder/qty', 'call', {
                'product_id': productIDs[0],
            }).then(function (data) {
                if (data != 0){
                    if (data[0]>value){
                        $input.val(data[0]).trigger("change");
                    } 
                    if (value > data[1]){
                        $('.js_quantity.form-control.quantity').popover({content : "You are trying to add more than available quantity for this product",
                            title: 'Warning',
                            placement: 'top',
                        });
                        $('.js_quantity.form-control.quantity').popover('show');
                        $input.val(data[1]).trigger("change");
                        setInterval(function(){ 
                            $('.js_quantity.form-control.quantity').popover('hide');
                        }, 500);
                    }
                }
            });
        },

        onClickAddQuantity: function(ev){
            ev.preventDefault();
            $('.form-control.quantity').popover('hide');
        },
    
        _onClickCartQuantity: function(ev){
            ev.preventDefault();
            $('.js_quantity.form-control.quantity').popover('hide');
        },

        onChangeAddQuantity: function (ev) {
            var $parent;
            if ($(ev.currentTarget).closest('.oe_optional_products_modal').length > 0){
                $parent = $(ev.currentTarget).closest('.oe_optional_products_modal');
            } else if ($(ev.currentTarget).closest('form').length > 0){
                $parent = $(ev.currentTarget).closest('form');
            }  else {
                $parent = $(ev.currentTarget).closest('.o_product_configurator');
            }
            this.triggerVariantChange($parent);

            var $link = $(ev.currentTarget);
            var $input = $link.closest('.input-group').find("input");
            var input_quant = $parent.find('.form-control').val();
            var value = parseInt(input_quant);
            $('.form-control.quantity').popover({content : "You are trying to add more than available quantity for this product",
                                                title: 'Warning',
                                                placement: 'top',
                                                });

            ajax.jsonRpc('/preorder/qty', 'call', {
                'product_id': this._getProductId($parent),
                }).then(function (data) {
                if (data != 0){
                    if (data[0]>value){
                        $input.val(data[0]).trigger("change");
                    } 
                    else if (data[1]<value){
                        $('.form-control.quantity').popover({content : "You are trying to add more than available quantity for this product",
                            title: 'Warning',
                            placement: 'top',
                        });
                        $('.form-control.quantity').popover('show');
                        $input.val(data[1]).trigger("change");
                        setInterval(function(){ 
                            $('.form-control.quantity').popover('hide');
                        }, 5000);
                    }
                }
            });
        
        },

        _onClickAddTocart: function (ev) {
            ev.preventDefault();
            var $parent;
            if ($(ev.currentTarget).closest('.oe_optional_products_modal').length > 0){
                $parent = $(ev.currentTarget).closest('.oe_optional_products_modal');
            } else if ($(ev.currentTarget).closest('form').length > 0){
                $parent = $(ev.currentTarget).closest('form');
            }  else {
                $parent = $(ev.currentTarget).closest('.o_product_configurator');
            }
            var $button = document.getElementById("add_to_cart");
            ajax.jsonRpc('/order/check', 'call', {"product_id" : this._getProductId($parent)}).then(function(data){
                if (data==0){
                    $button.click();
                }
                else {
                    $('.add_to_cart_custom').popover({content : data,
                                                title: 'Warning',
                                                placement: 'top',
                                                });
                    $('.add_to_cart_custom').popover('show');
                }
            });
        },
    });

    publicWidget.registry.websiteSaleCart.include({
        _onClickDeleteProduct: function (ev) {
            ev.preventDefault();
            var line_id = $(ev.currentTarget).closest('tr').find('.js_quantity').data('line-id');
            rpc.query({
                model:'sale.order.line',
                method: 'unlink',
                args:[line_id]
                }, {async: false}).then(function(output) {
                    if($('#cart_products tbody tr').length == 1){
                        $('.oe_cart').siblings('#o_cart_summary').removeClass('d-xl-block');
                        $('.oe_cart').html('<div class="alert alert-info"> Your cart is empty!</div>'); 
                        return window.location = '/shop/cart';
                    }
                    else{
                        $(ev.currentTarget).closest('tr').remove();
                    } 
            });
        }, 
    });
});

