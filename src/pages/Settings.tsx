import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Tag, LogOut, User, Moon, Sparkles, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { toast } from 'sonner';

interface SettingsProps {
  categories: Category[];
  onAddCategory: (name: string, color: string) => Promise<Category>;
  onUpdateCategory: (id: string, updates: { name?: string; color?: string }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#3B82F6', '#F97316', '#8B5CF6', '#06B6D4',
  '#EF4444', '#84CC16', '#6B7280', '#A855F7',
  '#EC4899', '#14B8A6', '#F59E0B', '#10B981',
];

export default function Settings({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: SettingsProps) {
  const { profile, updateProfile, signOut } = useAuth();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);

  const currentTheme = profile?.theme || 'midnight';

  const handleThemeChange = async (theme: 'midnight' | 'blossom') => {
    try {
      await updateProfile({ theme });
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'blossom') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      toast.success('Tema alterado!');
    } catch (error) {
      toast.error('Erro ao alterar tema');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      await onAddCategory(newCategoryName.trim(), newCategoryColor);
      toast.success('Categoria criada!');
      setIsAddingCategory(false);
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
    } catch (error) {
      toast.error('Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    setLoading(true);
    try {
      await onUpdateCategory(editingCategory.id, {
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      toast.success('Categoria atualizada!');
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setLoading(true);
    try {
      await onDeleteCategory(deletingCategory.id);
      toast.success('Categoria excluída!');
      setDeletingCategory(null);
    } catch (error) {
      toast.error('Erro ao excluir categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Você saiu da conta');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        {/* Theme Selection */}
        <Card className="mb-6 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Tema
            </CardTitle>
            <CardDescription>Escolha a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('midnight')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  currentTheme === 'midnight'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                    <Moon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Midnight Minimal</p>
                    <p className="text-xs text-muted-foreground">Escuro e elegante</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-slate-900" />
                  <div className="w-4 h-4 rounded-full bg-violet-500" />
                  <div className="w-4 h-4 rounded-full bg-slate-700" />
                </div>
                {currentTheme === 'midnight' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <button
                onClick={() => handleThemeChange('blossom')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  currentTheme === 'blossom'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Delicate Blossom</p>
                    <p className="text-xs text-muted-foreground">Suave e delicado</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full bg-pink-200" />
                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                  <div className="w-4 h-4 rounded-full bg-purple-400" />
                </div>
                {currentTheme === 'blossom' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card className="mb-6 card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categorias
                </CardTitle>
                <CardDescription>Gerencie suas categorias de dívidas</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setIsAddingCategory(true);
                  setNewCategoryName('');
                  setNewCategoryColor('#3B82F6');
                }}
                className="btn-press"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhuma categoria cadastrada
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingCategory(category);
                          setNewCategoryName(category.name);
                          setNewCategoryColor(category.color);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeletingCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Conta
            </CardTitle>
            <CardDescription>Gerencie sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full btn-press"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={isAddingCategory || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingCategory(false);
            setEditingCategory(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Mercado Pago"
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full transition-all ${
                      newCategoryColor === color
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategoryColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCategory(false);
                setEditingCategory(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              disabled={loading || !newCategoryName.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingCategory ? (
                'Salvar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              A categoria "{deletingCategory?.name}" será removida. As dívidas associadas
              ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
