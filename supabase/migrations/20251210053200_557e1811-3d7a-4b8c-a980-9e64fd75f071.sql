-- Create friendships table for user connections
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_user_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can see friendships where they are involved
CREATE POLICY "Users can view their friendships" ON public.friendships 
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "Users can create friendship requests" ON public.friendships 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update friendships they're involved in" ON public.friendships 
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_user_id);
CREATE POLICY "Users can delete their friendship requests" ON public.friendships 
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add linked_user_id to people table to link a person to a real user account
ALTER TABLE public.people ADD COLUMN linked_user_id UUID;

-- Create debt_notifications table for real-time notifications
CREATE TABLE public.debt_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.debt_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their notifications" ON public.debt_notifications 
  FOR SELECT USING (auth.uid() = to_user_id);
CREATE POLICY "Users can create notifications for others" ON public.debt_notifications 
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update their notifications" ON public.debt_notifications 
  FOR UPDATE USING (auth.uid() = to_user_id);
CREATE POLICY "Users can delete their notifications" ON public.debt_notifications 
  FOR DELETE USING (auth.uid() = to_user_id);

-- Create personal_expenses table (simpler than cards/bills)
CREATE TABLE public.personal_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personal_expenses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own expenses" ON public.personal_expenses 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expenses" ON public.personal_expenses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.personal_expenses 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.personal_expenses 
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_personal_expenses_updated_at
  BEFORE UPDATE ON public.personal_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.debt_notifications;