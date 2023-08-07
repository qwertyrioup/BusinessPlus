import React from 'react'
import { PieChart } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'

const PieChartWithCenteredLabels = ({jobCard, workOrder, stockEntry, billOfMaterials, items}) => {


 
    const data = [
        {
            key: 1,
            label:"Job Card",
            amount: jobCard,
            svg: { fill: '#FF7A00' },
        },
        {
            key: 2,
            label:"Work Order",
            amount: workOrder,
            svg: { fill: '#EC4899' }
        },
        {
            key: 3,
            label:"Stock Entry",
            amount: stockEntry,
            svg: { fill: '#6366F1' }
        },
        {
            key: 4,
            label:"Bill Of Materials",
            amount: billOfMaterials,
            svg: { fill: '#3B82F6' }
        },
        {
            key: 5,
            label:"items",
            amount: items,
            svg: { fill: '#14B8A6' }
        }
    ]
    const Labels = ({ slices, height, width }) => {
        return slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, data } = slice;
            return (
                <Text
                    key={index}
                    x={pieCentroid[ 0 ]}
                    y={pieCentroid[ 1 ]}
                    fill={'#fff'}
                    textAnchor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={14}
                    stroke={'black'}
                    strokeWidth={0.2}
                >
                    {data.amount}
                    
                </Text>
            )
        })
    }


  return (
    <PieChart
    style={{ height: 200, marginRight: 5 }}
    valueAccessor={({ item }) => item.amount}
    data={data}
    spacing={0}
    outerRadius={'95%'}
>
    <Labels/>
</PieChart>
  )
}

export default PieChartWithCenteredLabels