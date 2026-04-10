
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BankAccount } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Landmark, Edit2, Trash2, Banknote, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function AccountsPage() {
  const { formatCurrency, formatDate } = useSettings();
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    account_name: "",
    account_type: "checking",
    bank_name: "",
    manual_balance: ""
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await BankAccount.list("-created_date");
    setAccounts(data);
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      account_name: "",
      account_type: "checking",
      bank_name: "",
      manual_balance: ""
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      manual_balance: parseFloat(formData.manual_balance) || 0,
      last_updated: new Date().toISOString()
    };

    if (editingAccount) {
      await BankAccount.update(editingAccount.id, dataToSave);
    } else {
      await BankAccount.create(dataToSave);
    }

    loadAccounts();
    resetForm();
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      account_name: account.account_name,
      account_type: account.account_type,
      bank_name: account.bank_name || "",
      manual_balance: account.manual_balance?.toString() || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await BankAccount.delete(id);
      loadAccounts();
    }
  };
  
  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking': return <Banknote className="w-6 h-6" />;
      case 'savings': return <Landmark className="w-6 h-6" />;
      case 'credit_card': return <Banknote className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">
              My Accounts
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your connected bank accounts
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary-sage hover:bg-primary-sage/90 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Account
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-hover bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center">
                       {getAccountIcon(account.account_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.account_name}</CardTitle>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{account.bank_name}</p>
                    </div>
                  </div>
                   <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(account)} className="w-8 h-8 text-neutral-400 hover:text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)} className="w-8 h-8 text-neutral-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Balance</p>
                  <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{formatCurrency(account.manual_balance)}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Last updated: {formatDate(account.last_updated)}
                  </p>
                   <Link to={createPageUrl("Import")}>
                    <Button variant="outline" className="w-full mt-4">Import Transactions</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {accounts.length === 0 && (
          <Card className="text-center p-12 border-dashed">
            <h3 className="text-xl font-semibold">No accounts yet</h3>
            <p className="text-neutral-500 mt-2 mb-4">Add a bank account to start tracking your finances.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add your first account
            </Button>
          </Card>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>{editingAccount ? "Edit" : "Add"} Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="account_name">Account Name</Label>
                      <Input id="account_name" value={formData.account_name} onChange={(e) => setFormData({...formData, account_name: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input id="bank_name" value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="account_type">Account Type</Label>
                      <Select value={formData.account_type} onValueChange={(v) => setFormData({...formData, account_type: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="manual_balance">Current Balance</Label>
                      <Input id="manual_balance" type="number" step="0.01" value={formData.manual_balance} onChange={(e) => setFormData({...formData, manual_balance: e.target.value})} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                      <Button type="submit">{editingAccount ? "Save Changes" : "Add Account"}</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
