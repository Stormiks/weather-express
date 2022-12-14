#!/usr/bin/env python3

import sys
import logging
import time
from hdc1080 import hdc1080

sens = hdc1080.HDC1080()

logging.basicConfig(level=logging.INFO,  # change level looging to (INFO, DEBUG, ERROR)
                    format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                    datefmt='%m-%d %H:%M',
                    filename='hdc1080.log',
                    filemode='w')
console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

sens.write_register(register='CONF', bits=[
                    'MODE_BOTH', 'HRES_RES1', 'TRES_RES1'])

(serial, ret) = sens.serial()
(manufacturer, ret) = sens.manufacturer()
(deviceid, ret) = sens.deviceid()

serialNumber = serial

print('SensorDetail@deviceSerialNumber:', serial+',', 'manufacturerId:',
      manufacturer + ',', 'deviceId:', deviceid, flush=True)

while True:
    (temp, hmdt, ret) = sens.both_measurement()

    if ret == 0:
        strTmp = 'SensorData@deviceSerialNumber:' + \
            str(serialNumber)+',' + \
            'T:{:.2f}'.format(temp) + ',' + 'H:{:.2f}'.format(hmdt)
        print(strTmp, flush=True)
    else:
        sens._logger.error('Read error %s'.format(ret))
        print('status:500')

    time.sleep(300)


# =======================================================

# 15 14 13 12 11 10 09 08 07 06 05 04 03 02 01 00
# 0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0
# 00010110 00000000
# 1600
# MODE_ONLY = temperature or humidity is acquired
# HRES_RES1 = humidity 14 bit (10)
# TRES_RES1 = temperature 14 bit

#ret = sens.sw_reset()
#sens._logger.info('SW Reset correct') if ret == 0 else sens._logger.error('SW Reset error %s'.format(ret))
#ret = sens.write_register( register = 'CONF', bits = ['MODE_ONLY','HRES_RES1','TRES_RES1'])
#sens._logger.info('Write CONF register correct') if ret == 0 else sens._logger.error('Write error %s'.format(ret))
#register = hdc1080.register_list()
#print ('{}'.format(register))

#(temp, ret) = sens.measure_temp()
# if ret == 0 :
    #sens._logger.info('Measured Temperate IND: %s \u2103','{0:10.2f}'.format(temp))
# else :
    #sens._logger.error('Read error %s'.format(ret))

#(hmdt, ret) = sens.measure_hmdt()
# if ret == 0 :
    #sens._logger.info('Measured Humidity IND: %s %s','{0:10.2f}'.format(hmdt),'%')
# else :
    #sens._logger.error('Read error %s'.format(ret))

###########################################################
#ret = sens.sw_reset()
#sens._logger.info('SW Reset correct') if ret == 0 else sens._logger.error('SW Reset error %s'.format(ret))

#ret = sens.battery()
#sens._logger.info('Battery > 2.4V, correct') if ret == 0 else sens._logger.error('Battery < 2.4V, error')
#ret = sens.write_register( register = 'CONF', bits = ['TRES_RES2','HRES_RES2','MODE_ONLY','HEAT_DISABLE'])
#register = hdc1080.register_list()
#print ('{}'.format(register))
#(measure,ret) = hdc1080.measure_list()

# if ret == 0 :
    # print('{}'.format(measure))
# else :
    #sens._logger.error('Measure Read error %s'.format(ret))
