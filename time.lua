msPassed = 0
Citizen.CreateThread(function()
    while true do
        Wait(0)
        msPassed = msPassed + Timestep() * 1000
    end
end)

-- Citizen.CreateThread(function()
--     local total = 0
--     local c = 0
--     while true do
--         c = c + 1
--         local startTime = msPassed
--         Wait(1)
--         local endTime = msPassed
--         total = total + (endTime - startTime)
--         print('avg: ' .. total / c .. ' ms')
--     end
-- end)

-- Citizen.CreateThread(function()
--     while true do
--         Wait(0)
--         print(msPassed)
--     end
-- end)