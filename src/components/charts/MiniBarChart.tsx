import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface MiniBarChartProps {
  data: BarData[];
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export const MiniBarChart = ({
  data,
  height = 100,
  showLabels = true,
  className,
}: MiniBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="flex items-end justify-between gap-2 w-full"
        style={{ height: `${height}px` }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div className="relative w-full group">
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-300",
                    "bg-gradient-to-t hover:opacity-90",
                    item.color || "from-primary/80 to-primary"
                  )}
                  style={{ 
                    height: `${barHeight}%`,
                    minHeight: '4px'
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    {item.value.toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showLabels && (
        <div className="flex justify-between gap-2 mt-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="text-xs text-muted-foreground truncate block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
