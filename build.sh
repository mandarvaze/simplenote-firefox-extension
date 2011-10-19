#! /bin/bash
# Currently works only on *nix system, although not too difficult to run
# on windows, using some utility like 7zip

#VERSION=0.1
#Better to use date stamp than version number
DATE=`date +%F`
ZIP=/usr/bin/zip
SED=/bin/sed
RM=/bin/rm

$SED -e s/SN_VERSION/$DATE/ install_src.rdf > install.rdf
#Remove older XPI built today
$RM simplenote-$DATE.xpi
$ZIP -r simplenote-$DATE.xpi chrome chrome.manifest defaults install.rdf