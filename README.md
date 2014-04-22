relaycontrol-node
====================

MQTT controlled relays (node.JS-side code)

This runs a webpage (index.html) that does a periodic status check via MQTT to an Arduino running the relaycontrol-arduino code. The status check comes back in a form like so: 1001010000010000 which means that relays 1, 4, 6 and 12 are ON. This then takes that information and displays it in a tabluar format using the MetroUI CSS framework.

Upon clicking a relay box, it sends a message to the node server to publish a message with that relay number. This message is picked up by the relaycontrol-arduino device and the relay is flipped (turning ON or OFF). A status check is received when this operation is completed and the webpage updates accordingly.

This allows for multple connections and updates to occur at the same time whilst not impeding operations.


Requires
--------
node.JS with:
- socket.io
- http
- fs
- request

mosquitto (or appropriate MQTT server/client) (apt-get install mosquitto)

metroui (http://metroui.org.ua)


Take thsi code and run with it, props would be nice (beer would be nicer!) but not required. I'd love to see what you come up with.