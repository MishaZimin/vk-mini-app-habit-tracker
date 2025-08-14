import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  label: string;
  stroke?: number;
  color?: string;
};

export const CircleTimer = ({
  value,
  label,
  stroke = 12,
  color = '#4986cc',
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(160);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(value, 100);
  const offset = circumference * (1 - clampedValue / 100);

  return (
    <div
      ref={containerRef}
      className="w-full  max-w-[400px] aspect-square relative"
    >
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e1e3e6"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ fontSize: size * 0.12 }}>
          {label}
        </span>
      </div>
    </div>
  );
};
