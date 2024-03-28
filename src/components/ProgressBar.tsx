
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


export default function ProgressBar() {
  return <div className="col-span-1 h-96 md:h-auto md:col-span-2 rounded-tl-lg rounded-tr-lg bg-gradient-custom3">
    <h3 className="bg-custom-gray2 px-5 py-2 rounded-tl-lg rounded-tr-lg">Progress Bar</h3>
    <div className="flex justify-center items-center h-3/4 p-2">
      <Gauge
      width={200} 
      height={200} 
      value={75}
      startAngle={0}
      endAngle={360}
      innerRadius="75%"
      outerRadius="100%"
      />
    </div>

  </div>
}