import mqtt from 'mqtt';

const MQTT_WS_URL = 'ws://106.12.13.32:8083/mqtt';
const MQTT_OPTIONS = {
  username: 'zdzn',
  password: 'zdzn@1234',
  clientId: 'scada_client_' + Math.random().toString(16).substring(2, 8),
  connectTimeout: 10000,
  reconnectPeriod: 2000,
  clean: true,
};

export const createMqttClient = (onMessage: (topic: string, message: any) => void) => {
  console.log('Attempting to connect to MQTT:', MQTT_WS_URL);
  
  try {
    const client = mqtt.connect(MQTT_WS_URL, MQTT_OPTIONS);

    client.on('connect', () => {
      console.log('Connected to MQTT Broker successfully');
      client.subscribe('/sensor/jl_old/pub', (err) => {
        if (!err) {
          console.log('Subscribed to /sensor/jl_old/pub');
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log('📨 MQTT 数据接收:', payload.timestamp);
        onMessage(topic, payload);
      } catch (e) {
        console.warn('Received non-JSON MQTT message:', message.toString());
      }
    });

    client.on('error', (err) => {
      console.error('MQTT Client Error:', err);
    });

    client.on('offline', () => {
      console.warn('MQTT Client Offline');
    });

    client.on('reconnect', () => {
      console.log('MQTT Client Reconnecting...');
    });

    return client;
  } catch (error) {
    console.error('Failed to initialize MQTT client:', error);
    // Return a mock client to prevent app crash
    return {
      end: () => {},
      subscribe: () => {},
      on: () => {},
    } as any;
  }
};
