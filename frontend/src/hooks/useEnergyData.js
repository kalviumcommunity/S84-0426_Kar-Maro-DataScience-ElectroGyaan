import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useEnergyData(flatId = 'A101', pollInterval = 5000) {
  const [energyData, setEnergyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [hourlyPattern, setHourlyPattern] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevAnomalyCount = useRef(0);
  const [newAnomalyDetected, setNewAnomalyDetected] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [histRes, statsRes, anomRes, predRes] = await Promise.allSettled([
        apiClient.get(`/api/energy/history/${flatId}`),
        apiClient.get(`/api/energy/stats/${flatId}`),
        apiClient.get(`/api/energy/anomalies/${flatId}?limit=25`),
        apiClient.get(`/api/energy/predict/${flatId}`)
      ]);

      if (histRes.status === 'fulfilled') {
        setEnergyData(histRes.value.data.data || []);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data.stats || null);
      }

      if (anomRes.status === 'fulfilled') {
        const freshAnomalies = anomRes.value.data.data || [];
        
        if (prevAnomalyCount.current > 0 && freshAnomalies.length > prevAnomalyCount.current) {
          setNewAnomalyDetected(true);
          setTimeout(() => setNewAnomalyDetected(false), 500);
        }
        
        prevAnomalyCount.current = freshAnomalies.length;
        setAnomalies(freshAnomalies);
      }

      if (predRes.status === 'fulfilled') {
        setPrediction(predRes.value.data || null);
      }

      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [flatId]);

  const fetchHourlyPattern = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/energy/hourly-pattern/${flatId}`);
      setHourlyPattern(res.data.data || []);
    } catch (e) {
      // Silent fail
    }
  }, [flatId]);

  useEffect(() => {
    fetchAll();
    fetchHourlyPattern();
    
    const interval = setInterval(fetchAll, pollInterval);
    
    return () => clearInterval(interval);
  }, [fetchAll, fetchHourlyPattern, pollInterval]);

  return {
    energyData,
    stats,
    anomalies,
    prediction,
    hourlyPattern,
    loading,
    error,
    newAnomalyDetected,
    refetch: fetchAll
  };
}

export function useAdminData(pollInterval = 10000) {
  const [allFlats, setAllFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAnomalies, setTotalAnomalies] = useState(0);

  const fetchAdminData = useCallback(async () => {
    try {
      const [flatsRes, anomRes] = await Promise.allSettled([
        apiClient.get('/api/energy/all-flats'),
        apiClient.get('/api/energy/anomalies/all?limit=100')
      ]);

      if (flatsRes.status === 'fulfilled') {
        setAllFlats(flatsRes.value.data.data || []);
      }

      if (anomRes.status === 'fulfilled') {
        setTotalAnomalies(anomRes.value.data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
    
    const interval = setInterval(fetchAdminData, pollInterval);
    
    return () => clearInterval(interval);
  }, [fetchAdminData, pollInterval]);

  return {
    allFlats,
    totalAnomalies,
    loading,
    refetch: fetchAdminData
  };
}
