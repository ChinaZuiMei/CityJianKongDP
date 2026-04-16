import React from 'react';
import { Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { ScadaData } from '../types';
import { FlowBox } from './SharedComponents';

export const LoadingScreen = ({ data }: { data: ScadaData }) => (
  <div className="w-full h-full p-10 flex flex-col items-center gap-12">
    <h1 className="mb-12 text-center text-5xl font-black tracking-[0.2em] text-slate-100 uppercase">装车</h1>
    <div className="relative w-full max-w-5xl h-[500px] rounded-3xl border border-sky-200/55 bg-transparent flex flex-col items-center justify-center shadow-none">
      <div className="flex flex-col items-center gap-10">
        <div className="rounded-full border border-sky-200/70 bg-transparent px-8 py-3 text-3xl font-black tracking-widest text-sky-100 uppercase">
          聚铝装车界面
        </div>
        <motion.div animate={{ x: data.loading_instant > 0 ? [0, 10, 0] : 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="relative">
          <Truck size={180} className="text-sky-300" />
          {data.loading_instant > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-emerald-800 font-bold text-sm">
              正在装载...
            </motion.div>
          )}
        </motion.div>
        <div className="flex gap-8 mt-4">
          <FlowBox title="聚铝装车" instant={data.loading_instant} total={data.loading_total} />
        </div>
      </div>
    </div>
  </div>
);
