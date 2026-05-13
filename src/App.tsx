/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from 'react-router-dom';
import { BudgetProvider } from './BudgetContext';
import AppContent from './AppContent';

export default function App() {
  return (
    <BrowserRouter>
      <BudgetProvider>
        <AppContent />
      </BudgetProvider>
    </BrowserRouter>
  );
}
