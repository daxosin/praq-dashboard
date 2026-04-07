import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Generic hook for fetching data from a Supabase table
export function useTable(table, { select = '*', order, filter, enabled = true } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      let q = supabase.from(table).select(select)
      if (order) q = q.order(order.col, { ascending: order.asc ?? true })
      if (filter) {
        for (const [col, op, val] of filter) {
          q = q.filter(col, op, val)
        }
      }
      const { data: rows, error: err } = await q
      if (err) throw err
      setData(rows || [])
      setError(null)
    } catch (e) {
      setError(e.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, select, enabled])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// CRUD operations
export function useCrud(table) {
  const insert = async (row) => {
    const { data, error } = await supabase.from(table).insert(row).select()
    if (error) throw error
    return data[0]
  }

  const update = async (id, changes) => {
    const { data, error } = await supabase.from(table).update(changes).eq('id', id).select()
    if (error) throw error
    return data[0]
  }

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  }

  return { insert, update, remove }
}
