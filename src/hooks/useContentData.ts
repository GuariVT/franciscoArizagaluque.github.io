import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSectionContent(sectionKey: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSection = async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .eq('is_visible', true)
        .maybeSingle();

      if (!error && data) {
        setData(data);
      }
      setLoading(false);
    };

    loadSection();

    const channel = supabase
      .channel(`section-${sectionKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_sections',
          filter: `section_key=eq.${sectionKey}`,
        },
        () => {
          loadSection();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sectionKey]);

  return { data, loading };
}

export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false })
        .limit(6);

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };

    loadNews();

    const channel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news',
        },
        () => {
          loadNews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { news, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6);

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    loadEvents();

    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        () => {
          loadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading };
}

export function useGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_visible', true)
        .order('order_index');

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    loadImages();

    const channel = supabase
      .channel('gallery-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_images',
        },
        () => {
          loadImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { images, loading };
}
