import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { Expense } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const transactionSchema = {
  type: "object",
  properties: {
    transactions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date of the transaction, format YYYY-MM-DD" },
          description: { type: "string" },
          amount: { type: "number", description: "Expense amounts should be positive" }
        },
        required: ["date", "description", "amount"]
      }
    }
  }
};

const subcategoryOptions = {
  needs: ["rent", "groceries", "utilities", "transportation", "healthcare", "other"],
  wants: ["dining", "entertainment", "shopping", "subscriptions", "other"],
  savings: ["emergency_fund", "investments", "retirement", "other"]
};

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, extracting, review, importing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadAndExtract = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");
    try {
      const { file_url } = await UploadFile({ file });

      setStatus("extracting");
      const extractionResult = await ExtractDataFromUploadedFile({ file_url, json_schema: transactionSchema });

      if (extractionResult.status === "success" && extractionResult.output.transactions) {
        const processedTransactions = extractionResult.output.transactions
          .filter(t => t.amount) // Ensure amount exists
          .map((t, index) => ({
            ...t,
            id: index,
            amount: Math.abs(t.amount) * (t.description.toLowerCase().includes('payment') ? 1 : 1),
            category: "needs",
            subcategory: "other",
            notes: "",
            include: true,
            date: t.date ? new Date(t.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
          }));
        setTransactions(processedTransactions);
        setStatus("review");
      } else {
        throw new Error(extractionResult.details || "Failed to extract data. Check file format.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const handleTransactionChange = (id, field, value) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, [field]: value };
          if (field === "category") {
            updated.subcategory = subcategoryOptions[value][0] || "other";
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleImport = async () => {
    setStatus("importing");
    const expensesToCreate = transactions
      .filter(t => t.include)
      .map(({ title, description, amount, category, subcategory, date, notes }) => ({
        title: description,
        amount,
        category,
        subcategory,
        date,
        notes,
        is_recurring: false
      }));

    try {
      await Expense.bulkCreate(expensesToCreate);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to import expenses.");
    }
  };
  
  const resetState = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
    setTransactions([]);
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy dark:text-white mb-2">Import Transactions</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Upload a CSV from your bank to quickly add expenses.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {status === "idle" && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Upload File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <Label htmlFor="file-upload" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                      <span>Upload a file</span>
                      <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.xls,.xlsx" />
                    </Label>
                    <p className="text-xs text-gray-500">CSV, XLS, XLSX up to 10MB</p>
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                  <Button onClick={handleUploadAndExtract} disabled={!file}>Upload and Extract</Button>
                </CardContent>
              </Card>
            )}

            {(status === "uploading" || status === "extracting" || status === "importing") && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary-sage" />
                <p className="mt-4 text-lg font-medium capitalize">{status}...</p>
              </div>
            )}

            {status === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Review and Categorize</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Subcategory</TableHead>
                          <TableHead>Include</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>{t.date}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>${t.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Select value={t.category} onValueChange={(v) => handleTransactionChange(t.id, 'category', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="needs">Needs</SelectItem>
                                  <SelectItem value="wants">Wants</SelectItem>
                                  <SelectItem value="savings">Savings</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select value={t.subcategory} onValueChange={(v) => handleTransactionChange(t.id, 'subcategory', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {(subcategoryOptions[t.category] || []).map(sub => (
                                    <SelectItem key={sub} value={sub}>{sub.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input type="checkbox" checked={t.include} onChange={(e) => handleTransactionChange(t.id, 'include', e.target.checked)} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                     <Button variant="ghost" onClick={resetState}>Cancel</Button>
                     <Button onClick={handleImport}>Import {transactions.filter(t=>t.include).length} Transactions</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(status === "success" || status === "error") && (
              <Card className={status === "success" ? "border-green-500" : "border-red-500"}>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  {status === "success" ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  )}
                  <h3 className="mt-4 text-xl font-bold">
                    {status === "success" ? "Import Successful!" : "An Error Occurred"}
                  </h3>
                  <p className="mt-2 text-neutral-500">
                    {status === "success" ? "Your transactions have been added." : errorMessage}
                  </p>
                  <Button onClick={resetState} className="mt-6">Start New Import</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}