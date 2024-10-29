import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './css/Plotmobile.css';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

const Plotmobile = () => {
  const [data, setData] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]); // Default selected channels
  const [fetchInterval, setFetchInterval] = useState(300);

  const handleIntervalChange = (event) => {
    const max = 1000;
    const min = 50;
    const step = 50;

    // Calculate the value based on the slider's position
    const value = max - parseInt(event.target.value) * step;

    setFetchInterval(value);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/eeg/fakedata');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, fetchInterval);

    return () => clearInterval(interval);
  }, [fetchInterval]);


  // Function to generate distinct colors
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * (360 / numColors)) % 360;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  // Generate colors for the selected channels
  const channelColors = generateColors(selectedChannels.length);

  const chartOptions = {
    maintainAspectRatio: false,
    animation: false,
    events: [],
    pointStyle: false,
  };

  const handleChannelChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => parseInt(option.value));
    setSelectedChannels(selectedOptions);
  };

  const handleResetChannels = () => {
    setSelectedChannels([]);
  }

  const handleAreaClick = (channel) => {
    const chosenChannel = channel[0];
    if (!selectedChannels.includes(channel[0])) {
      const newSelectedOptions = [...selectedChannels, chosenChannel];
      setSelectedChannels(newSelectedOptions);
      console.log('ChosenChannel:', chosenChannel);
      console.log('Currently selected channels:', selectedChannels);
    } else {
      console.log('Channel ${channel} is already selected.');
    }
  };

  const bodyPart = 0; // Later received from the model
  // bodyPart == 0: none
  // bodyPart == 1: right hand
  // bodyPart == 2: left hand
  // bodyPart == 3: right leg
  // bodyPart == 4: left leg
  const bodyImage = "body" + bodyPart + ".png";

  return (
    <div>

      <div className='nav'>
        <div className='navLeft'>
          <img src="serpLogo.png" alt="The Serpentine Logo" />
        </div>
        <div className='navRight'>
          <p className='navRight-item'>
            <ScrollLink to="footer" smooth={true} duration={500}>About Us</ScrollLink>
          </p>
          <p className='navRight-item'>
            <ScrollLink to="footer" smooth={true} duration={500}>Contact</ScrollLink>
          </p>
        </div>
      </div>
      <div className="split-container">
        <div className="chart-container">
          <label htmlFor="channelSelector" className="chart-label">Select Channels:</label>
          <select
            id="channelSelector"
            multiple
            value={selectedChannels}
            onChange={handleChannelChange}
          >
            {Array.from({ length: 64 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Channel {i + 1}
              </option>
            ))}
          </select>
          <label htmlFor="fetchInterval" className="chart-label">
            Fetch Interval (ms):
          </label>
          <input
            type="range"
            id="fetchInterval"
            value={(1000 - fetchInterval) / 50} // Reversed value for the slider
            min="0" // Minimum fetch interval (50ms)
            max="19" // Maximum fetch interval (1000ms)
            step="1" // Step size
            onChange={handleIntervalChange}
          />

          <div className="charts">
            {selectedChannels.length === 0 ? (
              <p className="nothing-to-display">Nothing to display</p>
            ) : (
              // Render a Line chart for each selected channel
              selectedChannels.map((channel, index) => {
                const chartData = {
                  labels: data.map(entry => entry.sample),
                  datasets: [{
                    label: `Channel ${channel}`,
                    data: data.map(entry => entry[`Channel ${channel}`]),
                    fill: false,
                    borderColor: channelColors[index],
                  }],
                };

                return (
                  <div key={channel} className="chart">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="displayOnHuman">
          <img src={bodyImage} alt="Body part selection" />
        </div>

        <div className="eegCapImage">
          <img src="eegCapImage.png" useMap="#eegCapMap" alt="The EEG Cap image 64 channels" />
          <map name="eegCapMap">

           {/* <area shape="circle" coords="-100, 0, 15" onClick={() => handleAreaClick([1])} style={{ cursor: 'pointer' }} />

            {/*fp 1,2*/}
            <area shape="circle" coords="195, 105, 25" onClick={() => handleAreaClick([1])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="295, 105, 25" onClick={() => handleAreaClick([2])} style={{ cursor: 'pointer' }} />

            {/*f7, f3, fz, f4, f8*/}  
            <area shape="circle" coords="120, 155, 25" onClick={() => handleAreaClick([3])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="200, 160, 25" onClick={() => handleAreaClick([4])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="250, 160, 25" onClick={() => handleAreaClick([5])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="320, 155, 25" onClick={() => handleAreaClick([6])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="380, 155, 25" onClick={() => handleAreaClick([7])} style={{ cursor: 'pointer' }} />

            {/*t3, c3, cz, c4, t8*/}  
            <area shape="circle" coords="100, 245, 25" onClick={() => handleAreaClick([8])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="190, 245, 25" onClick={() => handleAreaClick([9])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="250, 245, 25" onClick={() => handleAreaClick([10])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="320, 250, 25" onClick={() => handleAreaClick([11])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="395, 250, 25" onClick={() => handleAreaClick([12])} style={{ cursor: 'pointer' }} />

            {/*t5, p3, pz, p4, t6*/}  
            <area shape="circle" coords="105, 365, 25" onClick={() => handleAreaClick([13])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="190, 345, 25" onClick={() => handleAreaClick([14])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="250, 345, 25" onClick={() => handleAreaClick([15])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="320, 350, 25" onClick={() => handleAreaClick([16])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="395, 350, 25" onClick={() => handleAreaClick([17])} style={{ cursor: 'pointer' }} />

            {/*O1, O2 */}
            <area shape="circle" coords="190, 425, 25" onClick={() => handleAreaClick([18])} style={{ cursor: 'pointer' }} />
            <area shape="circle" coords="320, 430, 25" onClick={() => handleAreaClick([19])} style={{ cursor: 'pointer' }} />

          </map>

          <div className="resetChannelsContainer">


            <button className="resetChannels" onClick={handleResetChannels} resetChannels >
              Reset Channels
            </button>

          </div>

        </div>
      </div>
      <div className="footer" id="footer">
        <div className="footer-left">
          <img src="serpLogo.png" alt="something" />
        </div>
        <div className="footer-center">
          <p className="footer-title">About Serpentine</p>
          <p>Serpentine is focused on developing Artificial Intelligence.
            We learn about developing algorithms, with which we compete in AI
            competitions and build projects. The association connects students,
            research and industry by sharing our knowledge on state of the art algorithms.</p>
          <p>© Serpentine 2019-2024</p>
        </div>
        <div className="footer-right">
          <p className="footer-title">About Us</p>
          <p>E.S.A.I.V. Serpentine</p>
          <p>Neuron</p>
          <p>Laplace 32</p>
          <p>5612AZ Eindhoven</p>
          <p>info@serpentineai.nl</p>
        </div>
      </div>
    </div>
  );
};

export default Plotmobile;
