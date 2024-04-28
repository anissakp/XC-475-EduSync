
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';



interface Props {
  weeklyPercent: number
};


const ProgressBar : React.FC<Props> = ({weeklyPercent}) => {

  return <div className="col-span-1 h-96 md:h-auto md:col-span-2 rounded-tl-lg rounded-tr-lg bg-gradient-custom3">
    <h3 className="bg-custom-gray2 px-5 py-2 rounded-tl-lg rounded-tr-lg">Weekly Progress Bar</h3>
    <div className="flex justify-center items-center h-auto p-2">
      <Gauge
        width={200} 
        height={200} 
        cornerRadius="50%"
        value={weeklyPercent}
        startAngle={0}
        endAngle={360}
        innerRadius="75%"
        outerRadius="100%"
        text={
          ({value}) => `${value}% \n completed`
        }
<<<<<<< HEAD
        sx={(theme) => ({
=======
        sx={() => ({
>>>>>>> e9ad0dafc77a367f6ba9ca50b4bdd653ee40d8d7
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#353638',
          },
        })}
      />
    </div>

  </div>
}

export default ProgressBar