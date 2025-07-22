import React from 'react';
import { Link } from 'react-router-dom';

export default function ReportCard({ report }) {
  return (
    <Link to={`/reports/${report.id}`}>
      <div className="block bg-white rounded-2xl shadow p-4 hover:shadow-md transition mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(report.date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
