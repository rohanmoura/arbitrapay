import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function TestScreen() {

  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.auth.getSession()
      console.log('Session:', data)
      console.log('Error:', error)
    }

    test()
  }, [])

  return (
    <View>
      <Text>Testing Supabase</Text>
    </View>
  )
}