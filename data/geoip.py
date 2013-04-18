import pygeoip

gic = pygeoip.GeoIP('GeoLiteCity.dat')

def get_geoip_data(IP):
    return gic.record_by_addr(IP)


for x in mov_obj2:
    if "1channel" in x:
        for hosts in x['1channel']:
            x['1channel'][hosts]['Location']['country_code3'] = gic.record_by_addr(x['1channel'][hosts]['IP'])['country_code3']
            x['1channel'][hosts]['Location']['city'] = gic.record_by_addr(x['1channel'][hosts]['IP'])['city']
            x['1channel'][hosts]['Location']['Lat'] = int(gic.record_by_addr(x['1channel'][hosts]['IP'])['latitude'])
            x['1channel'][hosts]['Location']['Lon'] = int(gic.record_by_addr(x['1channel'][hosts]['IP'])['longitude'])

