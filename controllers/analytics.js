const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        // count of order yesterday
        const yesterdayOrdersNumber = yesterdayOrders.length
        //count of orders
        const totalsOrdersNumber = allOrders.length;
        // count of all days
        const daysNumber = Object.keys(ordersMap).length
        // count of orders per day
        const ordersPerDay = (totalsOrdersNumber / daysNumber).toFixed(0)
        // % of count orders ((order yesterday \ count order per dat) - 1) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        // Total gain
        const totalGain = calculatePrice(allOrders)
        // Gain per day
        const gainPerDay = totalGain / daysNumber
        //Gain for yesterday
        const yesterdayGain = calculatePrice(yesterdayOrdersNumber)
        // % Gain
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        // Compare Gain
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        // Compare count orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrders,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }

}

module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user._id}).sort({date: 1})
        const orderMap = getOrdersMap(allOrders)

        const average = +(calculatePrice(allOrders) / Object.keys(orderMap).length).toFixed(2)

        const chart = Object.keys(orderMap).map(label => {
            const gain = calculatePrice(orderMap[label])
            const order = orderMap[label].length
            return {label, order, gain}
        })

        res.status(200).json({average, chart})
    } catch (e) {
        errorHandler(res, e)
    }

}


function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order)
    })
    return daysOrders
}

function calculatePrice(orders = []) {
    if (!orders.length) {
        return 0;
    } else {
        return orders.reduce((total, order) => {
            const orderPrice = order.list.reduce((orderTotal, item) => {
                return orderTotal += item.cost * item.quantity
            }, 0)
            return total += orderPrice
        }, 0)
    }
}
