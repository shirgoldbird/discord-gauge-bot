// set role names here
// gaugeAdminRole controls who can CREATE, DELETE, and UPDATE gauges
// gaugeEditRole controls who can UPDATE gauges
// anyone can VIEW gauges
// you can set these values to the same role if you don't want that granularity
// or set them to `null` if you want anyone to be able to take these actions

module.exports = {
    gaugeAdminRole: 'Gauge Admin',
    gaugeEditRole: 'Foo'
}