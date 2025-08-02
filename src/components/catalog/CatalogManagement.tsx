import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { catalogService, type CatalogItem, type ProductCategory } from '@/services/CatalogService';
import { Plus, Search, Package, Edit, Eye } from 'lucide-react';

export const CatalogManagement = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    sku: '',
    unit_of_measure: '',
    base_price: 0,
    specifications: {}
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    code: '',
    parent_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsResult, categoriesResult] = await Promise.all([
        catalogService.getCatalogItems(),
        catalogService.getCategories()
      ]);

      if (itemsResult.data) setItems(itemsResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load catalog data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const { data, error } = await catalogService.createCategory(newCategory);
      if (error) throw new Error(error.message);

      setCategories([...categories, data]);
      setNewCategory({ name: '', description: '', code: '', parent_id: '' });
      setIsAddCategoryOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddItem = async () => {
    try {
      const { data, error } = await catalogService.createCatalogItem(newItem);
      if (error) throw new Error(error.message);

      setItems([...items, data]);
      setNewItem({
        name: '',
        description: '',
        category_id: '',
        sku: '',
        unit_of_measure: '',
        base_price: 0,
        specifications: {}
      });
      setIsAddItemOpen(false);
      toast({
        title: "Success",
        description: "Catalog item created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Loading catalog...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Catalog Management</h1>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
                <Input
                  placeholder="Category Code"
                  value={newCategory.code}
                  onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                />
                <Textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
                <Select value={newCategory.parent_id} onValueChange={(value) => setNewCategory({...newCategory, parent_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Parent Category (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCategory} className="w-full">Create Category</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Catalog Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                  <Input
                    placeholder="SKU"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newItem.category_id} onValueChange={(value) => setNewItem({...newItem, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Unit of Measure"
                    value={newItem.unit_of_measure}
                    onChange={(e) => setNewItem({...newItem, unit_of_measure: e.target.value})}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Base Price"
                  value={newItem.base_price}
                  onChange={(e) => setNewItem({...newItem, base_price: parseFloat(e.target.value)})}
                />
                <Button onClick={handleAddItem} className="w-full">Create Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Catalog Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {item.base_price ? `${item.currency} ${item.base_price.toLocaleString()}` : 'Price on request'}
                  </p>
                  <p className="text-xs text-muted-foreground">per {item.unit_of_measure}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {item.product_categories && (
                <Badge variant="outline">
                  {item.product_categories.name}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory ? 
                'Try adjusting your filters or search terms.' :
                'Start by adding your first catalog item.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};