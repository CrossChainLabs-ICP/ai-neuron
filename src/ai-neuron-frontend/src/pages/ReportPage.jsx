import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { getReportDetail } from '../services/aiNeuronService';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  /*
  useEffect(() => {
    if (id) getReportDetail(id).then(setReport);
  }, [id]);
  */

  if (!report) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:underline mb-4"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{report.title}</h1>
      <article className="prose max-w-none mb-6">{report.content}</article>
      <section>
        <h2 className="text-xl font-semibold mb-2">Vulnerabilities</h2>
        {report.vulnerabilities.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {report.vulnerabilities.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
        ) : (
          <p className="text-gray-600">No vulnerabilities found.</p>
        )}
      </section>
    </div>
  );
}
