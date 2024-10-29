from .data_gen import data
import torch
from torch.utils.data import DataLoader
import numpy as np
class Inferer:
    
    def __init__(self, dataloader : data) -> None:
        self.dataloader = dataloader

    def predict(self):
        file_path = "eegdata/comfy2sus-2024-01-02-21-54-23.pth"
        model = torch.load(file_path,map_location=torch.device('cpu')) 

        data = self.dataloader.getLiveData()
        data = data.astype(np.float64)
        data = np.vstack((data, np.zeros((32, 640))))
        #data = data[:64, :]
        model.eval()

        tensor_input = torch.tensor(data, dtype=torch.float32)
        tensor_input = torch.unsqueeze(tensor_input, 0)
        print(tensor_input)

        with torch.no_grad():
            output = model(tensor_input)
        
        print(output)
        return output
