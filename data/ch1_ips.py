import pygeoip
 
gic = pygeoip.GeoIP('GeoLiteCity.dat')
 
def get_geoip_data(IP):
    return gic.record_by_addr(IP)
ch1Ips = ["88.80.29.60","93.158.114.134","188.40.110.86","50.7.245.186","80.79.118.158"]
 
ch1IpDict = {}
 
for ip in ch1Ips:
  ch1IpDict[ip] = gic.record_by_addr(ip)['country_code3']
 
ch1IpArray= []

for ent in ch1IpDict.items():
    print ent
    ch1IpArray.append(ent)

import json

f = open("ch1_ips.json", "w")

json.dump(ch1IpArray, f)
print ch1IpArray