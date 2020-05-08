import path from 'path';
import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import * as async from 'async';

const ECHO_PROTO_PATH = path.resolve(__dirname, '../../echo.proto');

const echoPackageDefinition = protoLoader.loadSync(ECHO_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const echoProtoDescriptor = grpc.loadPackageDefinition(echoPackageDefinition);
const echo: any = echoProtoDescriptor.echo;

function copyMetadata(call: any) {
  const metadata = call.metadata.getMap();
  const response_metadata = new grpc.Metadata();
  for (const key in metadata) {
    response_metadata.set(key, metadata[key]);
  }
  return response_metadata;
}

function doEcho(call: any, callback: any) {
  console.log('gRPC service doEcho');
  callback(
    null,
    {
      message: `${call.request.message} from server`,
    },
    copyMetadata(call)
  );
}

function doEchoAbort(call: any, callback: any) {
  callback({
    code: grpc.status.ABORTED,
    message: 'Aborted from server side.',
  });
}

function doServerStreamingEcho(call: any) {
  console.log('gRPC service doServerStreamingEcho');
  const senders = [];

  function sender(message: string, interval: number, index: number) {
    return (callback: () => void) => {
      console.log('asdasd');
      call.write({
        message: `${call.request.message} from server #${index}`,
      });

      setTimeout(callback, interval);
    };
  }

  for (let i = 0; i < call.request.message_count; i++) {
    senders[i] = sender(call.request.message, call.request.message_interval, i);
  }

  async.series(senders, (): void => {
    call.end(copyMetadata(call));
  });
}

function getServer() {
  const server = new grpc.Server();

  server.addService(echo.EchoService.service, {
    echo: doEcho,
    echoAbort: doEchoAbort,
    serverStreamingEcho: doServerStreamingEcho,
  });

  return server;
}

if (require.main === module) {
  // If this is run as a script, start a server on an unused port
  const echoServer = getServer();
  echoServer.bindAsync(
    '0.0.0.0:9090',
    grpc.ServerCredentials.createInsecure(),
    (error: Error | null, port: number) => {
      if (error) {
        console.log('error:', error);
      }

      echoServer.start();
    }
  );
}

exports.getServer = getServer;
0;
