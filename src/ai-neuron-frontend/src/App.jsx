//import { ai_neuron_backend } from 'declarations/ai-neuron-backend';
//import { ai_neuron_backend_worker } from 'declarations/ai-neuron-backend-worker';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ReportDetails from "./pages/ReportDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}