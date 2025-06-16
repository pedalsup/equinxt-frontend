// components/PieChartCard.tsx
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Completed', 'Pending', 'Failed'],
  datasets: [
    {
      label: 'Status',
      data: [60, 25, 15],
      backgroundColor: ['#10b981', '#facc15', '#ef4444'],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export function PieChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Application Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex justify-center items-center">
        <Pie data={data} options={options} />
      </CardContent>
    </Card>
  )
}
