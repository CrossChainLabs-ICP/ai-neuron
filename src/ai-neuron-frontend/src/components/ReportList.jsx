import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
//import { getReports } from '../services/aiNeuronService';
import ReportCard from './ReportCard';

const PAGE_SIZE = 20;

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    /*const data = await getReports(page, PAGE_SIZE);
    if (data.length < PAGE_SIZE) setHasMore(false);
    setReports(prev => [...prev, ...data]);
    setPage(prev => prev + 1);*/
  };

  useEffect(() => { loadMore(); }, []);

  return (
    <InfiniteScroll
      dataLength={reports.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<p className="text-center py-4">Loading...</p>}
      endMessage={<p className="text-center py-4 text-gray-500">No more reports</p>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => <ReportCard key={r.id} report={r} />)}
      </div>
    </InfiniteScroll>
  );
}
