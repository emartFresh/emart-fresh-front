// // export default function Show() {
// //   return <h1>Hello world!</h1>;
// // }
// import React, { useEffect, useState } from 'react';
// import * as Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// const Show = () => {
//     const initialOptions = {
//         title: { text: "Mobile vendor market share, 2021" },
//         chart: { type: "pie" },
//         series: [{
//             type: 'pie',
//             allowPointSelect: true,
//             keys: ['name', 'y', 'selected', 'sliced'],
//             data: [], // 데이터가 처음엔 비어있다.
//             showInLegend: true
//         }]
//     };

//     const [options, setOptions] = useState(initialOptions);

//     const asyncRequest = async () => {
//         // 임의의 비동기 요청이 있다고 가정한다. 
//         // 여기서는 예제 데이터를 바로 사용하도록 하겠습니다.
//         const result = {
//             data: [
//                 { text: 'dsdsdasdasd', value: 27.79 },
//                 { text: 'Apple', value: 27.34 },
//             ]
//         };

//         let tempSeries = [];
//         result.data.forEach(item => tempSeries.push({
//             name: item.text,   // 요소의 이름
//             y: item.value       // 값 
//         }));

//         // 옵션을 변경하면 자동으로 Highcharts가 갱신된다.
//         setOptions({
//             ...initialOptions,
//             series: [{ ...initialOptions.series[0], data: tempSeries }]
//         });
//     }

//     useEffect(() => {
//         asyncRequest();
//         return () => {
//             setOptions(initialOptions);
//         }
//     }, []);

//     return (
//         <div>
//             <HighchartsReact
//                 highcharts={Highcharts}
//                 options={options} />
//         </div>
//     );
// }

// export default Show;