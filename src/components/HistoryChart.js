import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const HistoryChart = ({ historyData }) => {
    const options = {
        title: { text: 'Lịch sử độ ẩm đất', style: { color: '#15803d', fontWeight: 'bold' } },
        xAxis: { type: 'datetime', title: { text: 'Thời gian' } },
        yAxis: { title: { text: 'Độ ẩm (%)' }, min: 0, max: 100 },
        navigator: { enabled: true },
        series: [{ name: 'Độ ẩm đất', type: 'line', data: historyData.map((item) => [item.time, item.value]), color: '#16a34a' }],
        credits: { enabled: false },
    };

    return (
        <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default HistoryChart;
