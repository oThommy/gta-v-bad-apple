RegisterCommand('init', function(_, args)
    local playerPed = PlayerPedId()
    local playerPos = GetEntityCoords(playerPed)
    local screenHeight = 10
    local screenWidth = 13
    local fps = 30
    local playerDist = args[1] or 20.0 -- distance from player in +y direction
    local vehDist = args[2] or 0.0 -- distance between two distinct vehicles
    local vehYawDeg = args[3] or 90.0
    local delay = args[4] or 5000
    local model = args[5] or 'panto'

    -- argument validation
    playerDist = tonumber(playerDist)
    if (playerDist == nil) then
        msg("'" .. args[1] .. "'" .. ' is not a valid player distance!')
        return
    else
        playerDist = playerDist + 0.0
    end

    vehDist = tonumber(vehDist)
    if (vehDist == nil) then
        msg("'" .. args[2] .. "'" .. ' is not a valid vehicle distance!')
        return
    elseif (vehDist < 0) then
        msg("'" .. args[2] .. "'" .. ' is not a valid vehicle distance')
        return
    else
        vehDist = vehDist + 0.0
    end

    vehYawDeg = tonumber(vehYawDeg)
    if (vehYawDeg == nil) then
        msg("'" .. args[3] .. "'" .. ' is not a valid vehicle yaw!')
        return
    else
        vehYawDeg = vehYawDeg + 0.0
    end

    delay = tonumber(delay)
    if (delay == nil) then
        msg("'" .. args[4] .. "'" .. ' is not a valid delay!')
        return
    elseif (delay < 0 or delay ~= math.floor(delay)) then
        msg("'" .. args[4] .. "'" .. ' is not a valid delay')
        return
    end

    if (not IsModelInCdimage(model) or not IsModelAVehicle(model)) then
        msg("'" .. model .. "'" .. ' is not a valid vehicle!')
        return
    end

    -- spawn vehicles
    local vehs = {}
    local vehHeight = 1.4729 -- panto height
    local vehDepth = 2.7385 -- panto depth (not exact, might be less)
    local vehWidth = 1.5165 -- panto width (rear) (not exact, might be less)
    local pixelLength = math.max(vehHeight, vehWidth) + vehDist
    local vehYawCfx = vehYawDeg - 90.0
    local origin = {
        ['x'] = playerPos.x - pixelLength * 0.5 * (screenWidth - 1),
        ['y'] = playerPos.y + playerDist,
        ['z'] = playerPos.z + pixelLength * 0.5 * (screenHeight - 1) 
    }
    _LoadModel(model)

    for i = 1, screenHeight do
        local row = {}
        for j = 1, screenWidth do
            local dx = (j - 1) * pixelLength
            local dz = -(i - 1) * pixelLength
            local veh = CreateVehicle(model, origin.x + dx, origin.y, origin.z + dz, vehYawCfx, true, false)
            FreezeEntityPosition(veh, true)
            SetEntityInvincible(veh, true)
            SetVehicleCustomPrimaryColour(veh, 0, 0, 0)
            SetVehicleCustomSecondaryColour(veh, 0, 0, 0)
            SetVehicleNumberPlateText(veh, "") -- remove license plate text
            SetVehicleNumberPlateTextIndex(veh, 1) -- set licence plate colour to black
            SetVehicleDirtLevel(veh, 0.0)
            -- SetVehicleExtraColours(veh, 5, 5) blijkbaar heeft dit ook nog invloed op de pearlescent colour: /init 20 0.5 90 0 patriot
            table.insert(row, veh)
        end
        table.insert(vehs, row)
    end

    SetModelAsNoLongerNeeded(model)

    -- move last row one vehicleWidth to the right (130 pixels needed, but only 128 available vehicles)
    for j = 1, screenWidth do
        local veh = vehs[screenHeight][j]
        local vehPos = GetEntityCoords(veh)
        SetEntityCoordsNoOffset(veh, vehPos.x + pixelLength, vehPos.y, vehPos.z)
    end
    table.insert(vehs[screenHeight], 1, table.remove(vehs[screenHeight])) -- shift all vehicles in the botom row one to the right to match screen shape

    -- animation
    local frameDelay = 1 / fps * 1000
    Wait(delay) -- delay
    msg('starts!')
    for f = 1, #frames do
        Citizen.SetTimeout(frameDelay * f, function()
            for i = 1, screenHeight do
                for j = 1, screenWidth do
                    local veh = vehs[i][j]
                    local colour = frames[f][i][j]
                    SetVehicleCustomPrimaryColour(veh, colour.R, colour.G, colour.B)
                    SetVehicleCustomSecondaryColour(veh, colour.R, colour.G, colour.B)
                    if (colour.R >= 128) then
                        SetVehicleNumberPlateTextIndex(veh, 0) -- set licence plate colour to white
                    else
                        SetVehicleNumberPlateTextIndex(veh, 1) -- set licence plate colour to black
                    end
                end
            end
        end)
    end

    -- delete vehicles
    Citizen.SetTimeout(frameDelay * #frames, function()
        for i = 1, screenHeight do
            for j = 1, screenWidth do
                local veh = vehs[i][j]
                DeleteEntity(veh)
            end
        end
    end)
end, false)

addSuggestion('init', 'playerDist', 'vehDist', 'vehYawDeg', 'delay', 'model')