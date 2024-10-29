import numpy as np
import time
import pandas as pd
from brainflow.board_shim import BoardShim, BrainFlowInputParams

#import utils.mneconv
from .settings import Config

class data:
    def __init__(self):
        # Initialize your data here
        self.configureBoard()

    def configureBoard(self):
        try:
            BoardShim.enable_dev_board_logger()
        except:
            raise Exception("BoardShim not found")
        config = Config()

        # Log all config values in config in debug mode

        params = BrainFlowInputParams()
        params.ip_port = config.ip_port
        params.ip_address = config.ip_address
        params.timeout = config.timeout
        params.serial_port = config.serial_port

        self.sfreq = BoardShim.get_sampling_rate(config.board_id)

        board_shim = BoardShim(config.board_id, params)
        if board_shim.is_prepared():
            print("Stopping existing stream")
            board_shim.release_session()
            board_shim.stop_stream()
        board_shim.prepare_session()
        

            # time (s) * sampling rate
            board_shim.start_stream(4 * 160) 
            self.board_shim = board_shim
        # time (s) * sampling rate
        board_shim.start_stream(5 * self.sfreq)
        
        self.board_shim = board_shim

    def getLiveData(self):
        sr = self.board_shim.get_current_board_data(4 * 160)
        return sr 

    def get_data(self):
        queue = []

        data = self.getLiveData()
        data = data.transpose()
        queue.append(data)
        
        npqueue = np.array(queue)
        flattened_data = npqueue.reshape(-1, npqueue.shape[-1])
        columns = [f'Channel {i+1}' for i in range(flattened_data.shape[1])]
        df = pd.DataFrame(flattened_data, columns=columns)
        df['sample'] = df.reset_index().index + 1
        return df
