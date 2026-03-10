import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Users, Radio } from 'lucide-react';

interface AIAlertModalProps {
  alert: {
    type: string;
    title: string;
    message: string;
    severity: string;
  };
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const AIAlertModal: React.FC<AIAlertModalProps> = ({ alert, onClose, onApprove, onReject }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'urgent': return 'from-orange-500 to-orange-600';
      case 'warning': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'samanjasya': return Users;
      case 'vishwas': return Radio;
      case 'suraksha': return MapPin;
      default: return AlertTriangle;
    }
  };

  const Icon = getIcon(alert.type);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getSeverityColor(alert.severity)} p-4`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{alert.title}</h3>
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2">AI Analysis</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{alert.message}</p>
          </div>

          {/* Confidence & Details */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Confidence</div>
                <div className="text-green-400 font-semibold">94.7%</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Priority</div>
                <div className={`font-semibold capitalize ${
                  alert.severity === 'critical' ? 'text-red-400' :
                  alert.severity === 'urgent' ? 'text-orange-400' :
                  alert.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {alert.severity}
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Sector</div>
                <div className="text-white font-semibold">Sector 5</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Estimated Impact</div>
                <div className="text-white font-semibold">15,000 pilgrims</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              onClick={onApprove}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Approve & Execute</span>
            </motion.button>
            
            <motion.button
              onClick={onReject}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              <span>Reject</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAlertModal;
