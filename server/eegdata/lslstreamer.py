from pylsl import StreamInlet, resolve_stream

class StreamingLayer:
    def streamer():
        streams = resolve_stream('type', 'EEG')
        if not streams:
            print("No EEG found, make sure the device or software is connected and running properly.")
            return "NO EEG"
        else:
            inlet = StreamInlet(streams[0])
            try:
                while True:
                    sample, timestamp = inlet.pull_sample()
                    print(f"Received EEG data: {sample} at timestamp {timestamp}")
                    return sample, timestamp
            except KeyboardInterrupt:
                print("Stopped receiving EEG data.")
                
    streamer()