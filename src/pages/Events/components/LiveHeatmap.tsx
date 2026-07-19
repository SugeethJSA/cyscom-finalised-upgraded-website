import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data generation for Check-in Heatmap
const generateMockData = () => {
  const data = [];
  let time = new Date();
  time.setHours(time.getHours() - 2); // Start 2 hours ago
  
  for (let i = 0; i < 15; i++) {
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkins: Math.floor(Math.random() * 50) + 10, // random checkins between 10-60
    });
    time.setMinutes(time.getMinutes() + 10);
  }
  return data;
};

export default function LiveHeatmap() {
  const [data, setData] = useState(generateMockData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const time = new Date();
        newData.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checkins: Math.floor(Math.random() * 50) + 10,
        });
        return newData;
      });
    }, 10000); // Add a new data point every 10 seconds for "live" effect
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl">
      <h4 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest flex justify-between items-center">
        Live Check-in Heatmap
        <span className="flex items-center gap-2 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          LIVE
        </span>
      </h4>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Area 
            type="monotone" 
            dataKey="checkins" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorCheckins)" 
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
