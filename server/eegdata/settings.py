import toml


class Config:
    # Load config.toml
    def load_config(self):
        try:
            config = toml.load('config.toml')
            self.timeout = config['wifi']['timeout']
            self.ip_address = config['wifi']['ip_address']
            self.ip_port = config['wifi']['ip_port']
            self.serial_port = config['board']['serial_port']
            self.board_id = config['board']['board_id']
            self.display_graph = config['env']['display_graph']
            self.output_fmt = config['env']['output_fmt']
            self.run_aquisition = config['env']['run_aquisition']
            self.run_model = config['env']['run_model']
            self.model_path = config['env']['model_path']
            self.fontsize = config['aquisition']['fontsize']
            self.wait_time = config['aquisition']['wait_time']
            self.trials_per_class = config['aquisition']['trials_per_class']
            self.warmup_trials = config['aquisition']['warmup_trials']
            self.perform_time = config['aquisition']['perform_time']

            # Make sure only one of run_aquisition, run_model and display_graph is set to True
            if [self.run_aquisition, self.run_model, self.display_graph].count(True) != 1:
                print('Error: Exactly one of run_aquisition, run_model and display_graph must be set to True.')
                exit(1)
        except TypeError:
            print('Error: config.toml not found or invalid.')
            exit(2)
        except toml.TomlDecodeError:
            print('Error: Parsing configuration file failed.')
            exit(3)
        except KeyError:
            print('Error: config.toml is missing required fields.')
            exit(4)

    # Load config on init
    def __init__(self):
        self.load_config()
