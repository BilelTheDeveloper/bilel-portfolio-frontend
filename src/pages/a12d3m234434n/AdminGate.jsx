import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AdminGate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // CHANGE THIS TO YOUR SECRET KEY
  const MASTER_KEY = "BILE2342423L_PR423424234O_A23432424LPHA_990603447936784724826496382462846238423"; 

  useEffect(() => {
    const key = searchParams.get('key');
    
    if (key === MASTER_KEY) {
      // Set a temporary session pass
      localStorage.setItem('gate_passed', 'true');
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  return null; // This component is invisible
}