const kb = require('./keyboard-buttons')

module.exports = {
    home: [
        [kb.home.we, kb.home.favourite],
        [kb.home.shop],
        [kb.home.our],
        [kb.home.Orders]
    ],
    shop: [
        [kb.shop.box, kb.shop.roz],
        [kb.shop.sv],
        [kb.shop.orders],
        [kb.back]
    ],
    favourite: [
        [kb.favourite.cab, kb.favourite.roz],
        [kb.favourite.lights], [kb.favourite.sv],
        [kb.favourite.cra],
        [kb.favourite.order],
        [kb.back]
    ],
    order: [
        [kb.order.apr],
        [kb.order.contact],
        [kb.back]
    ]
}