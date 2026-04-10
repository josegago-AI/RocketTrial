import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, TrendingUp } from "lucide-react";

export default function InvestmentForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    symbol: "",
    name: "",
    shares: "",
    purchase_price: "",
    current_price: "",
    sector: "technology",
    investment_type: "stock",
    portfolio_percentage: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      shares: parseFloat(formData.shares) || 0,
      purchase_price: parseFloat(formData.purchase_price) || 0,
      current_price: parseFloat(formData.current_price) || 0,
      portfolio_percentage: parseFloat(formData.portfolio_percentage) || 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
              <TrendingUp className="w-5 h-5" />
              {initialData ? "Edit Investment" : "Add Investment"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="AAPL"
                  value={formData.symbol}
                  onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment_type">Type</Label>
                <Select value={formData.investment_type} onValueChange={(value) => handleChange('investment_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="bond">Bond</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Company/Fund Name</Label>
              <Input
                id="name"
                placeholder="Apple Inc."
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  step="0.01"
                  placeholder="10"
                  value={formData.shares}
                  onChange={(e) => handleChange('shares', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_price">Avg Cost</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.purchase_price}
                  onChange={(e) => handleChange('purchase_price', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_price">Current Price</Label>
                <Input
                  id="current_price"
                  type="number"
                  step="0.01"
                  placeholder="165.00"
                  value={formData.current_price}
                  onChange={(e) => handleChange('current_price', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_percentage">Portfolio %</Label>
                <Input
                  id="portfolio_percentage"
                  type="number"
                  step="0.1"
                  placeholder="15.5"
                  value={formData.portfolio_percentage}
                  onChange={(e) => handleChange('portfolio_percentage', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select value={formData.sector} onValueChange={(value) => handleChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary-sage hover:bg-primary-sage/90 text-white">
                {initialData ? "Update" : "Add"} Investment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}