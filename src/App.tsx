/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetProvider } from './BudgetContext';
import AppContent from './AppContent';

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
